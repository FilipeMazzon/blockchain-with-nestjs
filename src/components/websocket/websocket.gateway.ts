import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

const P2P_PORT = parseInt(process.env.P2P_PORT, 10) || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS',
};

@WebSocketGateway(P2P_PORT)
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  connectedNodes: string[] = peers;

  async handleConnection(urlNode) {
    this.connectedNodes = [...this.connectedNodes, urlNode];
    this.server.emit('nodes', this.connectedNodes);
  }

  async handleDisconnect(urlNode: string) {
    const nodePos = this.connectedNodes.indexOf(urlNode);

    if (nodePos > -1) {
      this.connectedNodes = [
        ...this.connectedNodes.slice(0, nodePos),
        ...this.connectedNodes.slice(nodePos + 1),
      ];
    }

    // Sends the new list of connected nodes
    this.server.emit('nodes', this.connectedNodes);
  }

  @SubscribeMessage('get-all-info')
  async getAllInfo(client) {
    try {
      this.server.emite('event', {});
    } catch (e) {
      return new WsException(e);
    }
  }

  @SubscribeMessage('nodes')
  async updateNodes(nodes) {
    this.connectedNodes = nodes;
  }

  connectToPeers() {
    /*  peers.forEach(peer => {
        //const socket = new (peer);

        socket.on('open', () => this.server(socket));
      });*/
  }

  @SubscribeMessage('join')
  async onRoomJoin(client, data: any): Promise<any> {
    this.server.connect();
    client.join(data[0]);
    // Send last messages to the connected user
  }

  @SubscribeMessage('leave')
  onRoomLeave(client, data: any): void {
    client.leave(data[0]);
  }
}
