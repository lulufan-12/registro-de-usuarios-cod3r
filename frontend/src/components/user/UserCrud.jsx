import React from 'react'
import Main from '../template/Main'
import Axios from 'axios'

const headerProps = {
    icon: 'users',
    title: "Usuários",
    subtitle: "Cadastro de usuários: Incluir, Listar, Alterar e Excluir"
}

const baseURL = "http://localhost:3001/users"

const initialState = {
    user: {name:'', email:''},
    list: []
}

export default class UserCrud extends React.Component{

    state = {...initialState}

    clear(){
        this.setState({user: initialState.user})
    }

    save(){
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseURL}/${user.id}` : baseURL
        Axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({user: initialState.user, list})
            })
    }

    getUpdatedList(user, add = true){
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.unshift(user)
        return list
    }

    componentWillMount(){
        Axios(baseURL).then(resp => {
            this.setState({list: resp.data})
        })
    }


    updateField(event){
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        this.setState({user})
    }

    renderForm(){
        return (
            <div className="form">
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Nome</label>
                        <input type="text" name="name" className="form-control" value={this.state.user.name}
                            onChange={e => this.updateField(e)} placeholder="Digite o nome"></input>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" name="email" className="form-control" value={this.state.user.email}
                            onChange={e => this.updateField(e)} placeholder="Digite o email"></input>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>Salvar</button>
                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>Cancelar</button>
                    </div>
                </div>
            </div>
        )
    }

    load(user){
        this.setState({user})
    }

    remove(user){
        Axios.delete(`${baseURL}/${user.id}`).
        then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState ({list})
        })
    }

    renderTable(){
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows(){
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button onClick={() => this.load(user)} className="btn btn-warning">
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button onClick={() => this.remove(user)} className="btn btn-danger">
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render(){
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}