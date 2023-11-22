import { GithubUser } from "./GitHubUser.js"

// Classe que vai conter a lógica dos dados - Como vão ser estruturados

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
      }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error("Usuário já cadastrado")
            }

            const user = await GithubUser.search(username) 

            if(user.login === undefined) {
                throw new Error ('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.uptade()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    delete(user){
        //Higher-order functions (map, filter, find, reduce)
        const filteredEnteries = this.entries
        .filter((entry) => entry.login !== user.login)
        
        this.entries = filteredEnteries
        this.uptade()
        this.save()
    }
}

// Classe que vai criar a visualização e eventos do HTML

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        
        this.tbody = this.root.querySelector('table tbody')
        
        this.uptade()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
        
            this.add(value)
        }
    }

    uptade() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.creatRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').atl = `Imagem de ${user.name}`
            row.querySelector('.user p').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
               const isOk = confirm('Deletar essa linha?')
               if(isOk) {
                this.delete(user)
               }
            }
            
            this.tbody.append(row)
        })
    }


    creatRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = 
        `
        <td class="user">
            <img src="https://github.com/larinhab.png" alt="Foto de Lara Viana">
            <a href="">
                <p>Lara Viana</p>
                <span>larinhab</span>
            </a>
        </td>
        <td class="repositories">
            36
        </td>
        <td class="followers">19</td>
        <td>
            <button class="remove">&times</button>
        </td>`

        return tr
    }

    removeAllTr() {

        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }
}