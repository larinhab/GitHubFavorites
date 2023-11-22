// Classe que vai Buscar dados do github

export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(({login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }

}

// DETRUTURAÇÃO : 
// É uma técnica que possibilita extrair dados de um array/objeto 
// e os atribuir em variáveis distintas;