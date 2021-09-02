import React, { useEffect, useState } from 'react';
//useRouteMatch = pega a rota que da match que é passado na queryString da página
import { Link, useRouteMatch } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { api } from '../../services/api';
import { Header, RepoInfo, Issues } from './styles';
import logo from '../../assets/logo.svg';

interface IRepositoryParams {
  repository: string;
}

interface IGithubRepository {
  full_name: string;
  description: string;
  forks_count: number;
  open_issues_count: number;
  stargazers_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface IGithubIssues {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

export const Repo: React.FC = () => {
  //pode ser do tipo IGithubRepository ou também nulo
  const [repository, setRepository] = useState<IGithubRepository | null>(null);
  const [issues, setIssues] = useState<IGithubIssues[]>([]);
  const { params } = useRouteMatch<IRepositoryParams>();

  useEffect(() => {
    api
      .get(`repos/${params.repository}`)
      .then(response => setRepository(response.data));

    api
      .get(`repos/${params.repository}/issues`)
      .then(response => setIssues(response.data));
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logo} alt="GitCollection" />
        <Link to="/">
          <FiChevronLeft />
          Voltar
        </Link>
      </Header>

      {/*se tiver valor no repository ENTÃO apresenta o componente*/}
      {repository && (
        <RepoInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepoInfo>
      )}

      <Issues>
        {issues.map(issue => (
          <a
            href={issue.html_url}
            target="_blank"
            key={issue.id}
            rel="noreferrer"
          >
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>

            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};
