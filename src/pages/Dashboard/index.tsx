import React, {
  ChangeEvent,
  FormEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FiChevronRight } from 'react-icons/fi';
//Link transforma em um SPA (single page application) ele não recarrega toda a tela ao chamar outra pagina
//apenas o conteúdo diferente
import { Link } from 'react-router-dom';

import { api } from '../../services/api';
import { Title, Form, Repos, Error } from './styles';
import logo from '../../assets/logo.svg';

interface IGithubRepository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  //inicia o componente verificando se o localStorage (lista) está vazia
  //se estiver, retorna arrayVazio senão retornar os repositórios
  const [repos, setRepos] = useState<IGithubRepository[]>(() => {
    const storageRepos = localStorage.getItem('@GitCollection:repositories');

    if (storageRepos) {
      return JSON.parse(storageRepos);
    }

    return [];
  });
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const formEl = useRef<HTMLFormElement | null>(null);

  //toda vez que o repos for modificado, useEffect executa o localStorage
  useEffect(() => {
    localStorage.setItem('@GitCollection:repositories', JSON.stringify(repos));
  }, [repos]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    setNewRepo(event.target.value);
  }

  async function handleAddRepo(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    //não executa mais reload no onSubmit
    event.preventDefault();

    if (!newRepo) {
      setInputError('Informe o username/repositorio');
      return;
    }

    try {
      const response = await api.get<IGithubRepository>(`repos/${newRepo}`);

      const repository = response.data;
      //spread operator
      //pega tudo que já tem no repos e adiciona o que está vindo da const repository
      setRepos([...repos, repository]);
      formEl.current?.reset();
      setNewRepo('');
      setInputError('');
    } catch {
      setInputError('Repositório não encontrado no Github :( ');
    }
  }

  return (
    <>
      <img src={logo} alt="GitCollection" />
      <Title>Catálogo de repositórios do Github</Title>

      <Form
        ref={formEl}
        hasError={Boolean(inputError)}
        onSubmit={handleAddRepo}
      >
        <input
          placeholder="username/repository_name"
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repos>
        {/*Uso de 'index' para evitar erro de chave composta do navegador */}
        {repos.map((repository, index) => (
          <Link
            to={`/repositories/${repository.full_name}`}
            key={repository.full_name + index}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repos>
    </>
  );
};

export default Dashboard;
