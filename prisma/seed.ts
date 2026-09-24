async function main() {
  console.log("Database seed is ready for task data.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
