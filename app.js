document.addEventListener("DOMContentLoaded", () => {
  
  if (document.getElementById("project-container")) {
    loadProjectsPage();
  }

  if (document.getElementById("project-details")) {
    loadProjectDetailsPage();
  }
});


function loadProjectsPage() {
  const projectsContainer = document.getElementById("project-container");

  fetch("http://localhost:3000/projects")
    .then(res => res.json())
    .then(data => {
      projectsContainer.innerHTML = data.map(project => `
        <div class="project-card">
          <img src="${project.image}" alt="${project.name}">
          <h3>${project.name}</h3>
          <p><strong>Location:</strong> ${project.location}</p>
          <p><strong>Capacity:</strong> ${project.capacity}</p>
          <p><strong>Min Investment:</strong> ${project.minInvestment}</p>
          <button onclick="window.location.href='project.html?id=${project.id}'" class="invest-btn">
            Invest
          </button>
        </div>
      `).join("");
    })
    .catch(err => {
      projectsContainer.innerHTML = `<p style="color:red;">Error loading projects: ${err}</p>`;
    });
}


function loadProjectDetailsPage() {
  const projectDetails = document.getElementById("project-details");
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  fetch(`http://localhost:3000/projects/${projectId}`)
    .then(res => res.json())
    .then(project => {
      projectDetails.innerHTML = `
        <div class="project-info">
          <img src="${project.image}" alt="${project.name}">
          <h2>${project.name}</h2>
          <p><strong>Location:</strong> ${project.location}</p>
          <p><strong>Capacity:</strong> ${project.capacity}</p>
          <p><strong>Minimum Investment:</strong> ${project.minInvestment}</p>
          <p><strong>CO₂ Saved:</strong> ${project.co2Saved} kg</p>
          <p><strong>Energy Produced:</strong> ${project.energyProduced} kWh</p>
          
          <form class="investment-form">
            <label for="amount">Enter Investment Amount:</label>
            <input type="number" id="amount" min="${parseInt(project.minInvestment.replace(/\D/g,''))}" required>
            <button type="submit" class="invest-btn">Confirm Investment</button>
          </form>
        </div>
      `;

      document.querySelector(".investment-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const amount = document.getElementById("amount").value;

        const investmentData = {
          projectId: project.id,
          projectName: project.name,
          amount: Number(amount),
          timestamp: new Date().toISOString()
        };

        fetch("http://localhost:3000/investments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(investmentData)
        })
          .then(res => res.json())
          .then(data => {
            alert(`✅ You invested $${amount} in ${project.name}!`);
            console.log("Saved investment:", data);
          })
          .catch(err => {
            console.error("Error saving investment:", err);
            alert("❌ Failed to save investment. Try again.");
          });
      });
    })
    .catch(err => {
      projectDetails.innerHTML = `<p style="color:red;">Error loading project: ${err}</p>`;
    });
}
