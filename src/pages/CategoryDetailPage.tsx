import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getCategory,
  getCategoryGames,
  setCategoryGames,
  updateCategory,
} from '../api/categories';
import { listAdminGames } from '../api/admin-games';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';
import { categorySchema, type CategoryForm } from '../lib/validators';
import { paths } from '../routes/paths';
import type { AdminGame } from '../types/api';

type Tab = 'details' | 'games';

export function CategoryDetailPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('details');
  const [gameSearch, setGameSearch] = useState('');
  const [selectedGames, setSelectedGames] = useState<AdminGame[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [savingGames, setSavingGames] = useState(false);

  const { data: category, isLoading: loadingCategory } = useQuery({
    queryKey: ['admin-category', id],
    queryFn: () => getCategory(id),
    enabled: Boolean(id),
  });

  const { data: categoryGames, isLoading: loadingGames } = useQuery({
    queryKey: ['admin-category-games', id],
    queryFn: async () => {
      const assignments = await getCategoryGames(id);
      return assignments.map((a) => a.game);
    },
    enabled: Boolean(id),
  });

  const { data: searchResults, isFetching: searching } = useQuery({
    queryKey: ['admin-games-search', gameSearch],
    queryFn: () => listAdminGames(0, 10, { search: gameSearch || undefined }),
    enabled: tab === 'games' && gameSearch.length >= 2,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (!category) return;
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      imageUrl: category.imageUrl ?? '',
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      showOnHome: category.showOnHome,
    });
  }, [category, reset]);

  useEffect(() => {
    if (categoryGames) {
      setSelectedGames(categoryGames);
    }
  }, [categoryGames]);

  const onSubmitDetails = async (form: CategoryForm) => {
    setMessage('');
    setError('');
    try {
      await updateCategory(id, {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
        showOnHome: form.showOnHome,
      });
      setMessage('Categoria atualizada.');
      await queryClient.invalidateQueries({ queryKey: ['admin-category', id] });
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const addGame = (game: AdminGame) => {
    if (selectedGames.some((g) => g.id === game.id)) return;
    setSelectedGames((prev) => [...prev, game]);
    setGameSearch('');
  };

  const removeGame = (gameId: string) => {
    setSelectedGames((prev) => prev.filter((g) => g.id !== gameId));
  };

  const moveGame = (index: number, direction: 'up' | 'down') => {
    setSelectedGames((prev) => {
      const next = [...prev];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const saveGames = async () => {
    setSavingGames(true);
    setMessage('');
    setError('');
    try {
      await setCategoryGames(id, selectedGames.map((g) => g.id));
      setMessage('Jogos da categoria salvos.');
      await queryClient.invalidateQueries({ queryKey: ['admin-category-games', id] });
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingGames(false);
    }
  };

  if (loadingCategory) return <Spinner />;

  if (!category) {
    return <Alert variant="error">Categoria não encontrada.</Alert>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link to={paths.gameCategories} className="text-sm text-casino-green hover:underline">
          ← Voltar para categorias
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-white">{category.name}</h1>
      <p className="mt-1 text-sm text-casino-muted">Slug: {category.slug}</p>

      <div className="mt-4 flex gap-2 border-b border-casino-border">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium ${tab === 'details' ? 'border-b-2 border-casino-green text-white' : 'text-casino-muted'}`}
          onClick={() => setTab('details')}
        >
          Detalhes
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium ${tab === 'games' ? 'border-b-2 border-casino-green text-white' : 'text-casino-muted'}`}
          onClick={() => setTab('games')}
        >
          Jogos da Categoria
        </button>
      </div>

      {message && <div className="mt-4"><Alert variant="success">{message}</Alert></div>}
      {error && <div className="mt-4"><Alert variant="error">{error}</Alert></div>}

      {tab === 'details' && (
        <Card className="mt-6 max-w-lg">
          <form className="space-y-3" onSubmit={(e) => void handleSubmit(onSubmitDetails)(e)}>
            <Input label="Nome" {...register('name')} error={errors.name?.message} />
            <Input label="Slug" {...register('slug')} error={errors.slug?.message} />
            <Input label="Descrição" {...register('description')} />
            <Input label="URL da imagem" {...register('imageUrl')} error={errors.imageUrl?.message} />
            <Input label="Ordem" type="number" {...register('sortOrder', { valueAsNumber: true })} />
            <label className="flex items-center gap-2 text-sm text-casino-muted">
              <input type="checkbox" className="rounded" {...register('isActive')} />
              Categoria ativa
            </label>
            <label className="flex items-center gap-2 text-sm text-casino-muted">
              <input type="checkbox" className="rounded" {...register('showOnHome')} />
              Exibir na Home
            </label>
            <Button type="submit" loading={isSubmitting}>Salvar</Button>
          </form>
        </Card>
      )}

      {tab === 'games' && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-semibold text-white">Adicionar jogos</h2>
            <Input
              className="mt-3"
              placeholder="Buscar jogos (mín. 2 caracteres)"
              value={gameSearch}
              onChange={(e) => setGameSearch(e.target.value)}
            />
            {searching && <Spinner />}
            {searchResults && gameSearch.length >= 2 && (
              <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto">
                {searchResults.data.map((game) => (
                  <li key={game.id} className="flex items-center justify-between rounded border border-casino-border px-3 py-2 text-sm">
                    <span>{game.name} <span className="text-casino-muted">({game.provider})</span></span>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={selectedGames.some((g) => g.id === game.id)}
                      onClick={() => addGame(game)}
                    >
                      Adicionar
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-white">Jogos na categoria ({selectedGames.length})</h2>
              <Button loading={savingGames} onClick={() => void saveGames()}>Salvar ordem</Button>
            </div>

            {loadingGames && <Spinner />}

            {selectedGames.length === 0 && !loadingGames && (
              <Alert variant="info">Nenhum jogo associado. Busque e adicione jogos acima.</Alert>
            )}

            {selectedGames.length > 0 && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>#</TableHeaderCell>
                    <TableHeaderCell>Jogo</TableHeaderCell>
                    <TableHeaderCell>Ordem</TableHeaderCell>
                    <TableHeaderCell>Ações</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedGames.map((game, index) => (
                    <TableRow key={game.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div>{game.name}</div>
                        <div className="text-xs text-casino-muted">{game.provider}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button type="button" size="sm" variant="ghost" disabled={index === 0} onClick={() => moveGame(index, 'up')}>↑</Button>
                          <Button type="button" size="sm" variant="ghost" disabled={index === selectedGames.length - 1} onClick={() => moveGame(index, 'down')}>↓</Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeGame(game.id)}>Remover</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
