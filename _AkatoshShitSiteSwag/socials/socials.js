
async function gang() {
    const fun = document.querySelector("body > div > div > div.susHold > div.Discord > a");
    textToCopy = fun.textContent.split(" ")[0];
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      }
    } catch (err) {
      console.error(err);
    }
  }