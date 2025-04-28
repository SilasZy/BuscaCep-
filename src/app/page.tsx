'use client';
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {  z } from "zod";

type DadosCep = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  ddd: string;
  regiao: string;
  ibge: string;
  siafi: string;
  estado: string;
  uf: string;
  
};
export default function Home() {
  const [cep, setCep] = useState("");

  const [dadosCep, setDadosCep] = useState<DadosCep | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const maskCep = (value: string) => {
  return value
    .replace(/\D/g, "") // Remove caracteres não numéricos
    .replace(/(\d{5})(\d)/, "$1-$2") // Adiciona o hífen após os 5 primeiros dígitos
    .replace(/(-\d{3})\d+?$/, "$1"); // Limita a 8 dígitos no total
};
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const maskedValue = maskCep(value);
    setCep(maskedValue);
  };

  
  async function buscarCep(cep: string) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = response.data;
      setDadosCep(dados);
    } catch (err) {
      console.error("Erro ao buscar CEP", err);
    }
  }

  const searchDadosCep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    let cepValue = formData.get("cep") as string;
    cepValue = cepValue.replace(/\D/g, "");
    const schema = z.object({
      cep: z.string().length(8, { message: "CEP deve ter 8 dígitos" }),
    });

    const validation = schema.safeParse({ cep: cepValue });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
 
      setLoading(false);
      return;
    }
    setCep(cepValue);
    await buscarCep(cepValue);
    setLoading(false);
    setOpenModal(true);
  };

  return (
    <div>
      <nav className="bg-green-400  sm:mx-auto dark:bg-[#4ade80] ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center">
            <Link href="#" className="flex items-center">
              <Image
                src="/search.svg"
                width={30}
                height={30}
                className="h-8 mr-3"
                alt="BuscaCep Logo"
                
              />
              <span className="self-center  text-2xl font-semibold whitespace-nowrap dark:text-black">
                BuscaCep
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <form
        onSubmit={searchDadosCep}
        className="flex flex-col items-center justify-center mt-10"
      >
        <div className="flex mb-2 ">
          <input
            name="cep"
            type="search"
            id="default-search"
            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-l-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Buscar Cep"
            value={cep}
           onChange={handleCepChange}
            required
            
          />
          <button
            type="submit"
            className="text-black  bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-lg px-6 py-3 transition"
          >
     Buscar 
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2 min-h-[1.5rem]">{error}</p>
        )}
      </form>

      {loading && (
        
        <div className="flex justify-center mt-5">
          <p className="text-lg font-semibold">Buscando...</p>
        </div>
      )}

      {openModal && dadosCep && (
        <div className="modal ">
          <div className="modal-content bg-white   dark:text-[#080808] mx-auto  lg:w-2xl mt-10 p-3 rounded-lg shadow-lg">
            <div className="flex justify-center mt-10">
              <h1 className="text-2xl font-bold dark:text-[#080808]">
                Resultado da Pesquisa do Cep
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">CEP:</h2>
    {dadosCep?.cep || 'cep não encontrado'}
  </div>
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">Logradouro:</h2>
    {dadosCep?.logradouro || 'Logradouro não encontrado'}
  </div>
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">Bairro:</h2>
    {dadosCep?.bairro || 'Bairro não encontrado'}
  </div>
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">UF:</h2>
    {dadosCep?.uf || 'UF não encontrado'}
  </div>
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">Localidade:</h2>
    {dadosCep?.localidade || 'Localidade não encontrada'}
  </div>
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">DDD:</h2>
    {dadosCep?.ddd || 'DDD não encontrado'}
  </div>
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">Região:</h2>
    {dadosCep?.regiao || 'Região não encontrada'}
  </div>
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">IBGE:</h2>
    {dadosCep?.ibge || 'Ibge não encontrado'}
  </div>
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">Siafi:</h2>
    {dadosCep?.siafi || 'Siafi não encontrado'}
  </div>
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">ESTADO:</h2>
    {dadosCep?.estado || 'Estado não encontrado'}
  </div>
</div>
            
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="bg-red-500 w-full text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition duration-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// {
//   "cep": "23812-310",
//   "logradouro": "Rua São João",
//   "complemento": "",
//   "unidade": "",
//   "bairro": "São José",
//   "localidade": "Itaguaí",
//   "uf": "RJ",
//   "estado": "Rio de Janeiro",
//   "regiao": "Sudeste",
//   "ibge": "3302007",
//   "gia": "",
//   "ddd": "21",
//   "siafi": "5839"
// }