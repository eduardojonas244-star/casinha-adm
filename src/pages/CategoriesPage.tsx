import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../api/categories';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';
import { categorySchema, type CategoryForm } from '../lib/validators';
import type { GameCategory } from '../types/api';

const PAGE_SIZE = 20;

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
  });

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', slug: '', description: '', imageUrl: '' });
  };

  const openEdit = (cat: GameCategory) => {
    setEditing(cat);
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      imageUrl: cat.imageUrl ?? '',
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

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta categoria?')) return;
    try {
      await deleteCategory(id);
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Todas as Categorias</h1>
      <p className="mt-1 text-sm text-casino-muted">Gerencie categorias do catálogo</p>

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
                    <TableHeaderCell>Slug</TableHeaderCell>
                    <TableHeaderCell>Ações</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.data.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell className="text-casino-muted">{cat.slug}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>Editar</Button>
                          <Button variant="ghost" size="sm" onClick={() => void handleDelete(cat.id)}>Excluir</Button>
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
