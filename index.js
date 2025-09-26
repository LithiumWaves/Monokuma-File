// Monokuma File UI Extension - Editable version
(async () => {
  function waitForST() {
    return new Promise((resolve) => {
      if (window.SillyTavern && SillyTavern.getContext) return resolve();
      const t = setInterval(() => {
        if (window.SillyTavern && SillyTavern.getContext) {
          clearInterval(t);
          resolve();
        }
      }, 200);
    });
  }

  await waitForST();

  // State (persisted in localStorage)
  let monokumaFile = JSON.parse(localStorage.getItem("monokumaFile")) || {
    victim: "Unknown",
    location: "Unknown",
    cause: "Unknown",
    time: "Unknown"
  };

  // Insert wand button
  function addWandButton() {
    const menu = document.querySelector('#extensionsMenu');
    if (!menu || document.querySelector('#monokuma-file-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'monokuma-file-btn';
    btn.className = 'menu_button';
    btn.innerText = '📄 Monokuma File';
    btn.onclick = toggleFilePanel;
    menu.appendChild(btn);
  }

  // Render panel
  function renderFilePanel() {
    let panel = document.querySelector('#monokuma-file-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'monokuma-file-panel';
      document.body.appendChild(panel);
    }

    panel.innerHTML = `
      <div class="monokuma-file-header">Monokuma File #1</div>
      <div class="monokuma-file-body">
        <label>Victim:<br><input type="text" id="mf-victim" value="${monokumaFile.victim}"></label>
        <label>Location:<br><input type="text" id="mf-location" value="${monokumaFile.location}"></label>
        <label>Cause of Death:<br><input type="text" id="mf-cause" value="${monokumaFile.cause}"></label>
        <label>Time of Death:<br><input type="text" id="mf-time" value="${monokumaFile.time}"></label>
      </div>
    `;

    // Hook inputs
    ["victim", "location", "cause", "time"].forEach((field) => {
      const input = panel.querySelector(`#mf-${field}`);
      input.addEventListener("change", () => {
        monokumaFile[field] = input.value;
        localStorage.setItem("monokumaFile", JSON.stringify(monokumaFile));
      });
    });
  }

  // Toggle
  function toggleFilePanel() {
    const panel = document.querySelector('#monokuma-file-panel');
    if (panel && panel.style.display === 'block') {
      panel.style.display = 'none';
    } else {
      renderFilePanel();
      document.querySelector('#monokuma-file-panel').style.display = 'block';
    }
  }

  // Add button when extensions menu appears
  const obs = new MutationObserver(addWandButton);
  obs.observe(document.body, { childList: true, subtree: true });
})();
