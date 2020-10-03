import UserRepository from "./UserRepository";
import NewsRepository from "./NewsRepository";
import BrandingRepository from "./BrandingRepository";

const repositories = {
    user_repository: UserRepository,
    news_repository: NewsRepository,
    branding_repository: BrandingRepository
};

export const RepositoryFactory = {
    get: name => repositories[name]
};
