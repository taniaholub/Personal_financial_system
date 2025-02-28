import { userService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { Mock } from 'jest-mock';

describe('userService', () => {
  let service: userService;
  let userRepository: jest.Mocked<Repository<User>>;
  let roleRepository: jest.Mocked<Repository<Role>>;

  beforeEach(() => {
    userRepository = { save: jest.fn() } as any;
    roleRepository = { findOneBy: jest.fn() } as any;

    service = new userService(userRepository, roleRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
