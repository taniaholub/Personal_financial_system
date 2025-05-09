import { userService } from './user.service';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { Role } from '../../entity/role.entity';
import { AuthService } from '../auth/auth.service'; // Додано AuthService

describe('userService', () => {
  let service: userService;
  let userRepository: jest.Mocked<Repository<User>>;
  let roleRepository: jest.Mocked<Repository<Role>>;
  let authService: jest.Mocked<AuthService>; // Додано AuthService

  beforeEach(() => {
    userRepository = { save: jest.fn() } as any;
    roleRepository = { findOneBy: jest.fn() } as any;
    authService = { generateTokens: jest.fn() } as any; // Мок для AuthService

    service = new userService(authService, userRepository, roleRepository); // Тепер передаємо всі три залежності
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
