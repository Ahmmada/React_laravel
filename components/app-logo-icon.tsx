    export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      src="/icons/app-logo2.png"
      alt="App Logo"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
}