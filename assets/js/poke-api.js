
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = String(pokeDetail.id).padStart(4, '0')
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    // pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    // sprites/pokemon/other/dream-world/2.svg
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default || pokeDetail.sprites.other['official-artwork'].front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 20) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => {

            const count = jsonBody.count

            const speciesDetailRequests = jsonBody.results.map (species => 
                fetch(species.url).then(response => response.json())
            )

            return Promise.all(speciesDetailRequests)
                .then(speciesDetails => {
                    const pokemonDetailRequests = speciesDetails.map(speciesDetail => {
                        const defaultPokemonUrl = speciesDetail.varieties[0].pokemon.url
                        return pokeApi.getPokemonDetail({ url: defaultPokemonUrl })
                    })

                    return Promise.all(pokemonDetailRequests)
                        .then(pokemonsDetails => {
                            return {
                                pokemons: pokemonsDetails.sort((a, b) => a.number - b.number),
                                count: count
                            }
                        })
                    })
        })
    }
