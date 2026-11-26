const repositoryList = document.querySelector("#repository-list");
const repositoryStatus = document.querySelector("#repository-status");

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function createRepositoryCard(repository) {
  const item = document.createElement("li");
  item.className = "repository-card";

  const link = document.createElement("a");
  link.className = "repository-name";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repository.full_name;
  item.append(link);

  if (repository.description) {
    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;
    item.append(description);
  }

  const details = document.createElement("p");
  details.className = "repository-details";

  if (repository.language) {
    const language = document.createElement("span");
    language.textContent = repository.language;
    details.append(language);
  }

  const starred = document.createElement("span");
  starred.textContent = `Starred ${formatDate(repository.starred_at)}`;
  details.append(starred);
  item.append(details);

  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();

    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    if (repositories.length === 0) {
      repositoryStatus.textContent = "No starred repositories yet.";
      return;
    }

    repositoryList.replaceChildren(...repositories.map(createRepositoryCard));
    repositoryStatus.textContent = "";
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    repositoryStatus.classList.add("is-error");
    repositoryStatus.textContent = "Could not load repositories. Please try again later.";
  }
}

loadRepositories();
