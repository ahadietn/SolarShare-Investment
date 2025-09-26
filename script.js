document.addEventListener("DOMContentLoaded", () => {
  const exploreBtn = document.getElementById("explore-btn");
  const projectsSection = document.getElementById("projects");
  const projectsContainer = document.getElementById("projects-container");

  projectsSection.style.display = "none";

  exploreBtn.addEventListener("click", () => {
    projectsSection.style.display = "block";
    fetchProjects();
    projectsSection.scrollIntoView({ behavior: "smooth" });
  });

  function fetchProjects() {
    fetch("http://localhost:3000/projects")
      .then((res) => res.json())
      .then((data) => {
        const container=document.getElementById("projects-container");
        projectsContainer.innerHTML = "";
        data.forEach((project) => {
          const card = document.createElement("div");
          card.classList.add("project-card");

          card.innerHTML = `
            <img src="${project.image}" alt="${project.name}">
              <h3>${project.name}</h3>
              <p><strong>📍 Location:</strong> ${project.location}</p>
              <p><strong>⚡ Capacity:</strong> ${project.capacity}</p>
              <p><strong>💰 Min Investment:</strong> ${project.minInvestment}</p>
              <p><strong>🌍 CO₂ Saved:</strong> ${project.co2Saved} kg</p>
              <p><strong>🔋 Energy Produced:</strong> ${project.energyProduced} kWh</p>
          `;

          projectsContainer.appendChild(card);
        });
      })
      .catch((err) => {

      });
  }
});
