import { GithubUser } from "./GithubUser.js";

//Classe que vai conter a lógica dos dados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();

    GithubUser.search("Dev-JoaoVictor").then();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("Usuário já cadastrado");
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

//classe que cria a visualização e evento HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `imagem de ${user.name}`;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span ").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha");
        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
    this.emptyList();
  }

  emptyList() {
    const tabela = document.querySelector("table");
    const aviso = document.querySelector(".empty-list");
    const rows = tabela.querySelectorAll(".user-row");
  
    if (rows.length === 0) {
      aviso.classList.remove("hidden");
    } else {
      aviso.classList.add("hidden");
    }
  }

  createRow() {
    const tr = document.createElement("tr");
    tr.classList.add("user-row");

    tr.innerHTML = `
    <td class="user">
      <img
        src="https://github.com/Dev-JoaoVictor.png"
        alt="Imagem de João victor"
      />
      <a href="https://github.com/Dev-JoaoVictor" target="_blank">
        <p>João Victor</p>
        <span>Dev-JoaoVictor</span>
      </a>
    </td>
    <td class="repositories">53</td>
    <td class="followers">53</td>
    <td>
      <button class="remove">remover</button>
    </td>
  `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
