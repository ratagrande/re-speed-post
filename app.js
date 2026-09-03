(() => {
  const fileInput = document.querySelector("#video-file");
  const video = document.querySelector("#video-preview");
  const emptyPreview = document.querySelector("#empty-preview");
  const speed = document.querySelector("#speed-control");
  const speedValue = document.querySelector("#speed-value");
  const reset = document.querySelector("#reset-tool");
  const status = document.querySelector("#tool-status");
  const fileName = document.querySelector("#file-name");
  const originalDuration = document.querySelector("#original-duration");
  const adjustedDuration = document.querySelector("#adjusted-duration");
  const resolution = document.querySelector("#video-resolution");
  const fileSize = document.querySelector("#file-size");
  let objectUrl = null;

  const formatDuration = (seconds) => {
    if (!Number.isFinite(seconds)) return "—";
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds - minutes * 60;
    return minutes ? `${minutes}:${remaining.toFixed(1).padStart(4, "0")}` : `${remaining.toFixed(1)} sec`;
  };

  const updateSpeed = () => {
    const value = Number(speed.value);
    speedValue.value = `${value.toFixed(2)}×`;
    video.playbackRate = value;
    adjustedDuration.textContent = formatDuration(video.duration / value);
    status.textContent = `Previewing locally at ${value.toFixed(2)}× speed. Nothing has been uploaded.`;
  };

  const clearPreview = () => {
    video.pause();
    video.removeAttribute("src");
    video.load();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
    fileInput.value = "";
    video.hidden = true;
    emptyPreview.hidden = false;
    speed.value = "1";
    speed.disabled = true;
    reset.disabled = true;
    speedValue.value = "1.00×";
    fileName.textContent = "No video selected";
    originalDuration.textContent = "—";
    adjustedDuration.textContent = "—";
    resolution.textContent = "—";
    fileSize.textContent = "—";
    status.textContent = "Choose a local video to activate the preview.";
  };

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.hidden = false;
    emptyPreview.hidden = true;
    speed.disabled = false;
    reset.disabled = false;
    fileName.textContent = file.name;
    fileSize.textContent = `${(file.size / 1024 / 1024).toFixed(1)} MB`;
    status.textContent = "Loading local video metadata…";
  });

  video.addEventListener("loadedmetadata", () => {
    originalDuration.textContent = formatDuration(video.duration);
    resolution.textContent = `${video.videoWidth} × ${video.videoHeight}`;
    updateSpeed();
  });

  video.addEventListener("error", () => {
    status.textContent = "This browser could not preview that video format. Try an MP4, MOV, or WebM file.";
  });

  speed.addEventListener("input", updateSpeed);
  reset.addEventListener("click", clearPreview);
  window.addEventListener("beforeunload", () => { if (objectUrl) URL.revokeObjectURL(objectUrl); });
})();
