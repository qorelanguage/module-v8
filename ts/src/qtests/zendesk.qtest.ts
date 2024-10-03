import { ZENDESK_CONN_OPTIONS } from '../apps/zendesk';

let connection: string;

describe('Tests Zendesk Actions', () => {
  beforeAll(() => {
    // Create a connection to the Zendesk app
    connection = testApi.createConnection<typeof ZENDESK_CONN_OPTIONS>('zendesk', {
      opts: {
        subdomain: process.env.ZENDESK_SUBDOMAIN,
        username: process.env.ZENDESK_USER,
        password: process.env.ZENDESK_API_KEY,
        oauth2_grant_type: 'none',
      },
    });

    expect(connection).toBeDefined();
  });

  let ticketID: number;
  let ticketCount: number;

  it(`Should get account settings`, () => {
    const { body } = testApi.execAppAction('zendesk', 'ShowAccountSettings', connection);

    expect(body).toHaveProperty('settings');
    expect(body).toHaveProperty('settings.active_features');
  });

  it(`Should create a new ticket`, () => {
    const { body } = testApi.execAppAction('zendesk', 'CreateTicket', connection, {
      body: {
        ticket: {
          comment: {
            body: 'The smoke is very colorful.',
          },
          priority: 'urgent',
          subject: 'My printer is on fire!',
        },
      },
    });

    expect(body).toHaveProperty('ticket.id');
    ticketID = body.ticket.id;
  });

  it('Should get all tickets', () => {
    const { body } = testApi.execAppAction('zendesk', 'ListTickets', connection);

    expect(body).toHaveProperty('tickets');
    expect(body.tickets.length).toBeGreaterThan(0);

    ticketCount = body.tickets.length;
  });

  it('Should update a ticket', () => {
    console.log('Updating ticket', ticketID);
    const { body } = testApi.execAppAction('zendesk', 'UpdateTicket', connection, {
      ticket_id: ticketID,
      body: {
        ticket: {
          status: 'pending',
        },
      },
    });

    expect(body).toHaveProperty('ticket.id');
    expect(body.ticket.id).toBe(ticketID);
  });

  it('Should get a ticket by ID', () => {
    const { body } = testApi.execAppAction('zendesk', 'ShowTicket', connection, {
      ticket_id: ticketID,
    });

    expect(body).toHaveProperty('ticket');
    expect(body.ticket.id).toBe(ticketID);
    // Check if the body was updated
    expect(body.ticket.status).toBe('pending');
  });

  it('Should delete a ticket', () => {
    testApi.execAppAction('zendesk', 'DeleteTicket', connection, { ticket_id: ticketID });

    const tickets = testApi.execAppAction('zendesk', 'ListTickets', connection);

    expect(tickets.tickets.length).toBe(ticketCount - 1);
  });
});
