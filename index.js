// Monokuma File UI Extension - Multi-file Case Binder
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

  // Load from localStorage
  let monokumaFiles = JSON.parse(localStorage.getItem("monokumaFiles")) || [
    { victim: "Unknown", location: "Unknown", cause: "Unknown", time: "Unknown" }
  ];
  let currentFile = 0;

  function saveFiles() {
    localStorage.setItem("monokumaFiles", JSON.stringify(monokumaFiles));
  }

  // Add button to wand menu
  function addWandButton() {
    const menu = document.querySelector('#extensionsMenu');
    if (!menu || document.querySelector('#monokuma-file-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'monokuma-file-btn';
    btn.className = 'menu_button';
    btn.innerText = '📄 Mono. File';
    btn.onclick = toggleFilePanel;
    menu.appendChild(btn);
  }

  // Render full panel
  function renderFilePanel() {
    let panel = document.querySelector('#monokuma-file-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'monokuma-file-panel';
      document.body.appendChild(panel);
    }

    let options = monokumaFiles.map((f, i) => {
      return `<option value="${i}" ${i === currentFile ? "selected" : ""}>
        File #${i + 1}
      </option>`;
    }).join("");

    panel.innerHTML = `
      <div class="monokuma-file-header">
        <select id="mf-selector">${options}</select>
        <button id="mf-new-btn">+ New File</button>
      </div>
      <div class="monokuma-file-body">
        <label>Victim:<br><input type="text" id="mf-victim" value="${monokumaFiles[currentFile].victim}"></label>
        <label>Location:<br><input type="text" id="mf-location" value="${monokumaFiles[currentFile].location}"></label>
        <label>Cause of Death:<br><input type="text" id="mf-cause" value="${monokumaFiles[currentFile].cause}"></label>
        <label>Time of Death:<br><input type="text" id="mf-time" value="${monokumaFiles[currentFile].time}"></label>
      </div>
    `;

    // Dropdown change
    panel.querySelector('#mf-selector').addEventListener("change", (e) => {
      currentFile = parseInt(e.target.value, 10);
      renderFilePanel();
    });

    // Add new file
    panel.querySelector('#mf-new-btn').addEventListener("click", () => {
      monokumaFiles.push({
        victim: "Unknown",
        location: "Unknown",
        cause: "Unknown",
        time: "Unknown"
      });
      currentFile = monokumaFiles.length - 1;
      saveFiles();
      renderFilePanel();
    });

    // Hook inputs
    ["victim", "location", "cause", "time"].forEach((field) => {
      const input = panel.querySelector(`#mf-${field}`);
      input.addEventListener("change", () => {
        monokumaFiles[currentFile][field] = input.value;
        saveFiles();
      });
    });
  }

  // Toggle visibility
  function toggleFilePanel() {
    const panel = document.querySelector('#monokuma-file-panel');
    if (panel && panel.style.display === 'block') {
      panel.style.display = 'none';
    } else {
      renderFilePanel();
      document.querySelector('#monokuma-file-panel').style.display = 'block';
    }
  }

  // Inject wand button
  const obs = new MutationObserver(addWandButton);
  obs.observe(document.body, { childList: true, subtree: true });
})();
