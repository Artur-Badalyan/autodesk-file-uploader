import { Injectable } from '@nestjs/common';

@Injectable()
export class FlowersService {
  
  findAll() {
    return [
      {
        id: 1, name: 'Rose', color: 'Red'
      },
      {
        id: 2, name: 'Tulip', color: 'Yellow'
      }
    ];
  }
}
