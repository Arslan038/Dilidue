import UserRepository from './UserRepository';
import NewsRepository from './NewsRepository';
import BrandingRepository from './BrandingRepository';
import NotesRepository from './NotesRepository';

const repositories = {
  user_repository: UserRepository,
  news_repository: NewsRepository,
  branding_repository: BrandingRepository,
  notes_repository: NotesRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};
