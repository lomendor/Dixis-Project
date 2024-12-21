export const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

export const preloadComponent = (component: () => Promise<any>) => {
  component();
}; 