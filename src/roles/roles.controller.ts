import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {CreateRoleDto} from './dto/create-role.dto';
import {Role} from './roles.entity';
import {RolesService} from './roles.service';

@ApiTags('Роли пользователя')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({summary: 'Создание роли пользователя'})
  @ApiResponse({status: 200, type: Role})
  @Post()
  create(@Body() dto: CreateRoleDto) {
    try {
      return this.rolesService.createRole(dto);
    } catch (e) {
      console.error(e);
    }
  }

  @ApiOperation({summary: 'Получение роли по значению'})
  @ApiResponse({status: 200, type: Role})
  @Get('/:value')
  getByValue(@Param('param') param: string) {
    try {
      return this.rolesService.getRoleByValue(param);
    } catch (e) {
      console.error(e);
    }
  }
}
