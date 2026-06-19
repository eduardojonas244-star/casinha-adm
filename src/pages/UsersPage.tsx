import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listUsers } from '../api/users';
import { formatDate } from '../lib/money';
import { RoleBadge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';
import { paths } from '../routes/paths';

const PAGE_SIZE = 20;

export function UsersPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page],
    queryFn: () => listUsers(page, PAGE_SIZE),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Usuários</h1>
      <p className="mt-1 text-sm text-casino-muted">Lista de contas registradas na plataforma</p>

      {isLoading && <Spinner />}
      {error && <Alert variant="error" className="mt-4">{getErrorMessage(error)}</Alert>}

      {data && (
        <>
          <div className="mt-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Nome</TableHeaderCell>
                  <TableHeaderCell>E-mail</TableHeaderCell>
                  <TableHeaderCell>Perfil</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Criado em</TableHeaderCell>
                  <TableHeaderCell>{''}</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-casino-muted">Nenhum usuário encontrado.</TableCell>
                    <TableCell>{''}</TableCell>
                    <TableCell>{''}</TableCell>
                    <TableCell>{''}</TableCell>
                    <TableCell>{''}</TableCell>
                    <TableCell>{''}</TableCell>
                  </TableRow>
                ) : (
                  data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell className="text-casino-muted">{user.email}</TableCell>
                      <TableCell><RoleBadge role={user.role} /></TableCell>
                      <TableCell><StatusBadge status={user.status} /></TableCell>
                      <TableCell className="text-casino-muted">{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Link
                          to={paths.userDetail(user.id)}
                          className="text-xs font-semibold text-casino-green hover:underline"
                        >
                          Detalhes
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </Button>
            <span className="text-sm text-casino-muted">Página {page + 1}</span>
            <Button
              variant="secondary"
              size="sm"
              disabled={data.length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
