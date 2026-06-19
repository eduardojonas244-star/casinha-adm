import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../api/categories';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';
import { categorySchema, type CategoryForm } from '../lib/validators';
import { paths } from '../routes/paths';
import type { GameCategory } from '../types/api';

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function CategoriesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<GameCategory | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['admin-categories', page, search],
    queryFn: () => listCategories(page, PAGE_SIZE, search || undefined),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      isActive: true,
      showOnHome: false,
      sortOrder: 0,
    },
  });

  const openCreate = () => {
    setEditing(null);
    reset({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      sortOrder: 0,
      isActive: true,
      showOnHome: false,
    });
  };

  const openEdit = (cat: GameCategory) => {
    setEditing(cat);
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      imageUrl: cat.imageUrl ?? '',
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
      showOnHome: cat.showOnHome,
    });
  };

  const onSubmit = async (form: CategoryForm) => {
    setMessage('');
    setError('');
    try {
      const body = {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
        showOnHome: form.showOnHome,
      };
      if (editing) {
        await updateCategory(editing.id, body);
        setMessage('Categoria atualizada.');
      } else {
        await createCategory(body);
        setMessage('Categoria criada.');
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      openCreate();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (cat: GameCategory) => {
    const count = cat.gameCount ?? 0;
    const msg =
      count > 0
        ? `Esta categoria possui ${count} jogo(s). Deseja excluir mesmo assim? (jogos serão desvinculados)`
        : 'Excluir esta categoria?';
    if (!confirm(msg)) return;
    try {
      await deleteCategory(cat.id, count > 0);
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Todas as Categorias</h1>
      <p className="mt-1 text-sm text-casino-muted">Gerencie categorias exibidas na Home do site</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Pesquisar"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
          </div>

          {isLoading && <Spinner />}
          {queryError && <Alert variant="error">{getErrorMessage(queryError)}</Alert>}

          {data && (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Nome</TableHeaderCell>
                    <TableHeaderCell>Jogos</TableHeaderCell>
                    <TableHeaderCell>Ordem</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Home</TableHeaderCell>
                    <TableHeaderCell>Criado em</TableHeaderCell>
                    <TableHeaderCell>Ações</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.data.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>
                        <div className="font-medium">{cat.name}</div>
                        <div className="text-xs text-casino-muted">{cat.slug}</div>
                      </TableCell>
                      <TableCell>{cat.gameCount ?? 0}</TableCell>
                      <TableCell>{cat.sortOrder}</TableCell>
                      <TableCell>
                        <Badge variant={cat.isActive ? 'success' : 'danger'}>
                          {cat.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cat.showOnHome ? 'green' : 'muted'}>
                          {cat.showOnHome ? 'Sim' : 'Não'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-casino-muted">{formatDate(cat.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>Editar</Button>
                          <Link to={paths.gameCategoryDetail(cat.id)}>
                            <Button variant="ghost" size="sm" type="button">Jogos</Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => void handleDelete(cat)}>Excluir</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex gap-3">
                <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
                <span className="text-sm text-casino-muted">Página {page + 1} · {data.total} resultados</span>
                <Button variant="secondary" size="sm" disabled={(page + 1) * PAGE_SIZE >= data.total} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
              </div>
            </>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold text-white">{editing ? 'Editar categoria' : 'Nova categoria'}</h2>
          <form className="mt-4 space-y-3" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <Input label="Nome" {...register('name')} error={errors.name?.message} />
            <Input label="Slug" {...register('slug')} error={errors.slug?.message} />
            <Input label="Descrição" {...register('description')} />
            <Input label="URL da imagem" {...register('imageUrl')} error={errors.imageUrl?.message} />
            <Input label="Ordem" type="number" {...register('sortOrder', { valueAsNumber: true })} error={errors.sortOrder?.message} />
            <label className="flex items-center gap-2 text-sm text-casino-muted">
              <input type="checkbox" className="rounded" {...register('isActive')} />
              Categoria ativa
            </label>
            <label className="flex items-center gap-2 text-sm text-casino-muted">
              <input type="checkbox" className="rounded" {...register('showOnHome')} />
              Exibir na Home
            </label>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}
            <div className="flex gap-2">
              <Button type="submit" loading={isSubmitting}>{editing ? 'Salvar' : 'Criar'}</Button>
              {editing && <Button type="button" variant="secondary" onClick={openCreate}>Cancelar</Button>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
