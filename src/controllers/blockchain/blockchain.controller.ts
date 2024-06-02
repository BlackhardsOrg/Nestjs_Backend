import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { BlockchainService } from 'src/providers/services/blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {
    this.blockchainService.on('Mint', this.handleTransferEvent.bind(this));
  }

  @Get('events')
  getEvents(@Res() res: Response) {
    const pastEvents = this.blockchainService.getPastEvents();
    res.json({
      message: 'Listening to blockchain events...',
      events: pastEvents,
    });
  }

  private handleTransferEvent(event: any) {
    // Handle the event (e.g., log it, save it to the database, etc.)
    console.log('Transfer event received:', event.to);
    // You can also send this event to a client via WebSocket or any other means
  }
}
