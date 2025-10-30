import { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2, Plus, Tv, Film, Search } from 'lucide-react';
import type { Media, MediaFilters } from '../types';
import { mediaAPI } from '../api';
import MediaForm from './MediaForm';

const MediaTable: React.FC = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadMedia = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await mediaAPI.getMedia(pageNum, 10);
      setMedia(prev => append ? [...prev, ...response.media] : response.media);
      setHasMore(response.pagination.hasNextPage);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading media:', error);
      // For demo purposes, add some sample data if backend is not available
      if (media.length === 0) {
        setMedia([
          {
            id: 1,
            title: "Inception",
            type: "MOVIE",
            director: "Christopher Nolan",
            budget: "$160M",
            location: "LA, Paris",
            duration: "148 min",
            yearTime: "2010",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            title: "Breaking Bad",
            type: "TV_SHOW",
            director: "Vince Gilligan",
            budget: "$3M/ep",
            location: "Albuquerque",
            duration: "49 min/ep",
            yearTime: "2008-2013",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, media.length]);

  useEffect(() => {
    loadMedia(1, false);
  }, []);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
      return;
    }
    loadMedia(page + 1, true);
  }, [loading, hasMore, page, loadMedia]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleEdit = (mediaItem: Media) => {
    setEditingMedia(mediaItem);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setDeletingId(id);
    try {
      await mediaAPI.deleteMedia(id);
      setMedia(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Error deleting media. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSave = () => {
    loadMedia(1, false);
  };

  const getTypeIcon = (type: string) => {
    return type === 'MOVIE' ? <Film size={16} /> : <Tv size={16} />;
  };

  const getTypeColor = (type: string) => {
    return type === 'MOVIE' 
      ? 'bg-purple-100 text-purple-800 border-purple-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Favorite Movies & TV Shows</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your collection of favorite movies and TV shows
            </p>
          </div>
          <button
            onClick={() => {
              setEditingMedia(null);
              setIsFormOpen(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            <Plus size={20} className="mr-2" />
            Add New
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Director
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {media.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                        <span className="ml-1">
                          {item.type === 'MOVIE' ? 'Movie' : 'TV Show'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.director}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.budget}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.yearTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition duration-200"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition duration-200 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500">Loading more items...</p>
            </div>
          )}

          {/* No More Items */}
          {!hasMore && media.length > 0 && (
            <div className="text-center py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">No more items to load</p>
            </div>
          )}

          {/* Empty State */}
          {media.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Film size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No media items found</p>
              <p className="text-gray-400 text-sm mb-4">Add your first movie or TV show to get started</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Form Modal */}
      <MediaForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        media={editingMedia}
        onSave={handleFormSave}
      />
    </div>
  );
};

export default MediaTable;