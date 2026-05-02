import logo from "../../imports/master_orla_logo.png";

export function OrlaLogo({ className = "h-7" }: { className?: string }) {
  return <img src={logo} alt="Orla" className={className} />;
}
