import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© 2023 EPI Control - Service Départemental d'Incendie et de Secours</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:text-gray-300">Mentions légales</a>
            <a href="#" className="text-sm hover:text-gray-300">Politique de confidentialité</a>
            <a href="#" className="text-sm hover:text-gray-300">Contact</a>
          </div>
        </div>
        <MadeWithDyad />
      </div>
    </footer>
  );
}