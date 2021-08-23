import { QueryClient, QueryClientProvider, useQuery } from "react-query"
import "./App.css"

const fetchPokemonData = async (pokemon) => {
  let url = pokemon.url // <--- https://pokeapi.co/api/v2/pokemon/1/
  const pokemonData = await fetch(url)
  const result = await pokemonData.json()
  return result
}

const fetchPokemons = async () => {
  const allPokemon = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=20&offset=40"
  )
  const pokemonsList = await allPokemon.json()
  const pokemonsListWithData = []

  for (const pokemon of pokemonsList.results) {
    const pokemonWithData = await fetchPokemonData(pokemon)
    pokemonsListWithData.push(pokemonWithData)
  }

  return pokemonsListWithData
}

export const usePokemons = () => useQuery(["pokemons"], fetchPokemons)

function ComponentOne() {
  const { data } = usePokemons()

  return (
    <div className="flex-column">
      <h2>Component One</h2>
      {data?.map((pokemon) => (
        <div key={pokemon.id}>
          <span>Name: </span> <span>{pokemon.name}</span>
        </div>
      ))}
    </div>
  )
}

function ComponentTwo() {
  // ✅ will get exactly the same data as ComponentOne
  const { data } = usePokemons()

  return (
    <div className="flex-column">
      <h2>Component Two</h2>
      {data?.map((pokemon) => (
        <div key={pokemon.id}>
          <span>Name: </span> <span>{pokemon.name}</span>
        </div>
      ))}
    </div>
  )
}

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex">
        <ComponentOne />
        <ComponentTwo />
      </div>
    </QueryClientProvider>
  )
}

export default App
