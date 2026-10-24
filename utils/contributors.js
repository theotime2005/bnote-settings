async function contributors() {
  const requestFile = await $fetch("/contributors.txt", { responseType: "text" });
  const contributors = requestFile.split("\n");
  const filteredContributors = contributors.filter((contributor) => contributor !== "");
  return filteredContributors;
}

export { contributors };
