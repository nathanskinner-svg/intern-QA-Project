import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const examples: Prisma.TestCaseCreateInput[] = [
  {
    title: "User can sign in with valid credentials", feature: "Authentication",
    preconditions: "A verified user account exists.", expectedResult: "The user reaches the dashboard.",
    actualResult: "The user reached the dashboard.", status: "Pass", priority: "High",
    steps: { create: [
      { position: 1, action: "Open the sign-in page.", expectedOutcome: "The sign-in form is visible." },
      { position: 2, action: "Enter valid credentials and submit.", expectedOutcome: "The dashboard opens." },
    ] },
  },
  {
    title: "Invalid password shows an error", feature: "Authentication",
    preconditions: "A verified account exists and the sign-in page is open.",
    expectedResult: "A helpful error appears without clearing the email field.",
    actualResult: "The form remains unchanged and no error is displayed.", status: "Fail", priority: "High",
    steps: { create: [
      { position: 1, action: "Enter a valid email and an incorrect password.", expectedOutcome: "The values are accepted." },
      { position: 2, action: "Select Sign in.", expectedOutcome: "An invalid-credentials error is displayed." },
    ] },
    bugs: { create: [{ title: "Invalid credentials do not show an error", description: "The form gives no feedback after the server rejects a password.", stepsToReproduce: "Enter a valid email with an incorrect password and submit.", expectedBehavior: "An invalid-credentials message is displayed.", actualBehavior: "No feedback is displayed.", severity: "High", status: "Open" }] },
  },
  {
    title: "User can reset a forgotten password", feature: "Authentication",
    preconditions: "The user has access to a registered email address.", expectedResult: "A password-reset email is sent.",
    status: "Not Run", priority: "Medium",
    steps: { create: [
      { position: 1, action: "Select Forgot password.", expectedOutcome: "The reset form opens." },
      { position: 2, action: "Enter a registered email and submit.", expectedOutcome: "A confirmation message appears." },
    ] },
  },
  {
    title: "User can complete checkout", feature: "Checkout",
    preconditions: "The user is signed in with an in-stock item in the cart.",
    expectedResult: "The order is placed and a confirmation number appears.", actualResult: "The order was placed successfully.",
    status: "Pass", priority: "High",
    steps: { create: [
      { position: 1, action: "Open the cart and select Checkout.", expectedOutcome: "The shipping form appears." },
      { position: 2, action: "Enter shipping and payment information.", expectedOutcome: "The correct order total appears." },
      { position: 3, action: "Confirm the order.", expectedOutcome: "An order number is displayed." },
    ] },
  },
  {
    title: "Shipping is included in the order total", feature: "Checkout",
    preconditions: "A shippable item is in the cart.", expectedResult: "Subtotal, tax, and shipping add up to the displayed total.",
    actualResult: "Shipping is missing from the displayed total.", status: "Blocked", priority: "High",
    steps: { create: [
      { position: 1, action: "Proceed to checkout with a shippable item.", expectedOutcome: "Shipping options appear." },
      { position: 2, action: "Choose standard shipping.", expectedOutcome: "Shipping is included in the total." },
    ] },
    bugs: { create: [{ title: "Checkout total excludes shipping", description: "The review total only includes item subtotal and tax.", stepsToReproduce: "Add an item, choose standard shipping, and review the total.", expectedBehavior: "The total includes subtotal, tax, and shipping.", actualBehavior: "The displayed total is lower than the charged amount.", severity: "Critical", status: "In Progress" }] },
  },
  {
    title: "Cart quantity can be updated", feature: "Shopping Cart", preconditions: "One item is in the cart.",
    expectedResult: "The quantity and total update immediately.", actualResult: "The quantity and total updated correctly.",
    status: "Pass", priority: "Medium",
    steps: { create: [
      { position: 1, action: "Change the item quantity from one to three.", expectedOutcome: "The cart shows three items." },
      { position: 2, action: "Review the subtotal.", expectedOutcome: "The subtotal is three times the unit price." },
    ] },
  },
  {
    title: "Out-of-stock products cannot be added", feature: "Shopping Cart",
    preconditions: "An out-of-stock product page is open.", expectedResult: "The add-to-cart action is unavailable.",
    status: "Skipped", priority: "Low",
    steps: { create: [
      { position: 1, action: "Open an out-of-stock product.", expectedOutcome: "An out-of-stock label is visible." },
      { position: 2, action: "Inspect the purchase controls.", expectedOutcome: "Add to cart is disabled." },
    ] },
  },
  {
    title: "Profile changes are saved", feature: "User Profile",
    preconditions: "The user is signed in and viewing account settings.", expectedResult: "The new display name persists after refreshing.",
    status: "Not Run", priority: "Medium",
    steps: { create: [
      { position: 1, action: "Change the display name and save.", expectedOutcome: "A success message appears." },
      { position: 2, action: "Refresh the page.", expectedOutcome: "The new display name remains." },
    ] },
  },
  {
    title: "Search returns matching products", feature: "Product Search",
    preconditions: "The catalog contains wireless headphones.", expectedResult: "Relevant products appear in the results.",
    actualResult: "Relevant products appeared in under one second.", status: "Pass", priority: "Medium",
    steps: { create: [
      { position: 1, action: "Enter wireless headphones in search.", expectedOutcome: "Suggestions appear." },
      { position: 2, action: "Submit the search.", expectedOutcome: "Matching products are listed." },
    ] },
  },
  {
    title: "Order history opens order details", feature: "Orders",
    preconditions: "The signed-in user has a completed order.", expectedResult: "The selected order displays its items, total, and status.",
    status: "Not Run", priority: "Low",
    steps: { create: [
      { position: 1, action: "Open Order history.", expectedOutcome: "Previous orders are listed." },
      { position: 2, action: "Select the most recent order.", expectedOutcome: "Complete order details appear." },
    ] },
  },
];

async function main() {
  let added = 0;
  for (const example of examples) {
    const exists = await prisma.testCase.findFirst({ where: { title: example.title }, select: { id: true } });
    if (!exists) {
      await prisma.testCase.create({ data: example });
      added += 1;
    }
  }
  console.log(`Added ${added} example test cases. Existing data was preserved.`);
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
