/**
 * 创建一个音频播放器
 */
export const useAudio = () => {
  const audio = new Audio();

  const playing = ref(false);
  const loading = ref(false);
  const set = (src: string) => {
    audio.src = src;
    audio.play();
  };

  audio.addEventListener("play", () => {
    playing.value = true;
  });
  audio.addEventListener("pause", () => {
    playing.value = false;
  });
  audio.addEventListener("waiting", () => {
    loading.value = true;
  });
  audio.addEventListener("canplay", () => {
    loading.value = false;
  });
  audio.addEventListener("error", () => {
    loading.value = false;
  });

  return {
    playing,
    loading,
    set,
  };
};
