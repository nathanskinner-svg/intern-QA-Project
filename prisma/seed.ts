import { PrismaClient } from "@prisma/client";

// PrismaClient is the type-safe interface generated from schema.prisma.
const prisma = new PrismaClient();

async function main() {
  // Reset development data so running the seed more than once does not
  // create duplicates. Delete child records before their parent records.
  await prisma.bug.deleteMany();
  await prisma.testStep.deleteMany();
  await prisma.testCase.deleteMany();

  // A nested write creates the test case and all of its steps together.
  // Prisma automatically fills each step's testCaseId with loginTest.id.
  const loginTest = await prisma.testCase.create({
    data: {
      title: "User can sign in with valid credentials",
      feature: "Authentication",
      preconditions: "A verified user account exists.",
      expectedResult: "The user reaches the dashboard.",
      actualResult: "The user reached the dashboard.",
      status: "Pass",
      priority: "High",
      steps: {
        create: [
          {
            position: 1,
            action: "Open the sign-in page.",
            expectedOutcome: "The email and password fields are visible.",
          },
          {
            position: 2,
            action: "Enter valid credentials and submit the form.",
            expectedOutcome: "The user is redirected to the dashboard.",
          },
        ],
      },
    },
  });

  await prisma.testCase.create({
    data: {
      title: "Required fields reject an empty form",
      feature: "Authentication",
      preconditions: "The sign-in page is open.",
      expectedResult: "Validation messages appear for both required fields.",
      status: "Not Run",
      priority: "Medium",
      steps: {
        create: [{
          position: 1,
          action: "Submit the sign-in form without entering credentials.",
          expectedOutcome: "Required-field messages appear and the form is not submitted.",
        }],
      },
    },
  });

  // Keeping the returned test case lets us use its generated ID below.
  const checkoutTest = await prisma.testCase.create({
    data: {
      title: "User can complete checkout",
      feature: "Checkout",
      preconditions: "The user is signed in and an in-stock item is in the cart.",
      expectedResult: "The order is placed and a confirmation number is displayed.",
      actualResult: "The order review displays an incorrect total.",
      status: "Fail",
      priority: "High",
      steps: {
        create: [
          {
            position: 1,
            action: "Open the shopping cart and select Checkout.",
            expectedOutcome: "The shipping information form is displayed.",
          },
          {
            position: 2,
            action: "Enter valid shipping and payment information.",
            expectedOutcome: "The order review page shows the correct totals.",
          },
          {
            position: 3,
            action: "Confirm the order.",
            expectedOutcome: "An order confirmation and order number are displayed.",
          },
        ],
      },
    },
  });

  // This foreign key connects the bug to the test case created above.
  await prisma.bug.create({
    data: {
      title: "Invalid credentials do not show an error",
      description: "The form remains unchanged after the server rejects the credentials.",
      stepsToReproduce: "Open sign in, enter invalid credentials, and submit.",
      expectedBehavior: "An invalid-credentials message is displayed.",
      actualBehavior: "No feedback is displayed.",
      severity: "High",
      status: "Open",
      testCaseId: loginTest.id,
    },
  });

  await prisma.bug.create({
    data: {
      title: "Checkout total excludes shipping",
      description: "The order review total only includes the item subtotal and tax.",
      stepsToReproduce: "Add an item to the cart, enter shipping details, and open order review.",
      expectedBehavior: "The review total includes subtotal, tax, and shipping.",
      actualBehavior: "The displayed total is lower than the final charged amount.",
      severity: "Critical",
      status: "In Progress",
      testCaseId: checkoutTest.id,
    },
  });

  console.log("Seeded 3 test cases, 6 test steps, and 2 bugs.");
}

main()
  .catch((error) => {
    // A non-zero exit code tells scripts and CI that seeding failed.
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    // Always release the database connection, even after an error.
    await prisma.$disconnect();
  });
