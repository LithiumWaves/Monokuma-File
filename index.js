// Monokuma File UI Extension - index.js
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

  // State
  let monokumaFile = null;

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

    if (!monokumaFile) {
      monokumaFile = {
        victim: "Unknown",
        location: "Unknown",
        cause: "Unknown",
        time: "Unknown"
      };
    }

    panel.innerHTML = `
      <div class="monokuma-file-header">Monokuma File #1</div>
      <div class="monokuma-file-body">
        <p><b>Victim:</b> ${monokumaFile.victim}</p>
        <p><b>Location:</b> ${monokumaFile.location}</p>
        <p><b>Cause of Death:</b> ${monokumaFile.cause}</p>
        <p><b>Time of Death:</b> ${monokumaFile.time}</p>
      </div>
    `;
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
