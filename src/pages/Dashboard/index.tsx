import React, { ChangeEvent, FormEvent, Fragment, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

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

export const Dashboard: React.FC = () => {
  const [repos, setRepos] = useState<IGithubRepository[]>([]);
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');

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

    setInputError('');

    const response = await api.get<IGithubRepository>(`repos/${newRepo}`);

    const repository = response.data;

    //spread operator
    //pega tudo que já tem no repos e adiciona o que está vindo da const repository
    setRepos([...repos, repository]);
    setNewRepo('');
  }

  return (
    <>
      <img src={logo} alt="GitCollection" />
      <Title>Catálogo de repositórios do Github</Title>

      <Form hasError={Boolean(inputError)} onSubmit={handleAddRepo}>
        <input
          placeholder="username/repository_name"
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repos>
        {repos.map(repository => (
          <a href="/repositories" key={repository.full_name}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repos>
    </>
  );
};
