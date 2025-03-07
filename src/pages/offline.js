export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Sin conexión</h1>
        <p className="text-gray-600">
          Por favor, verifica tu conexión a internet e intenta nuevamente.
        </p>
      </div>
    </div>
  );
}
