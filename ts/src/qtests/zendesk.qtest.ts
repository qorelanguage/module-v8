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
    const response = testApi.execAppAction('zendesk', 'ShowAccountSettings', connection);

    expect(response).toHaveProperty('settings');
    expect(response).toHaveProperty('settings.active_features');
  });

  it(`Should create a new ticket`, () => {
    const response = testApi.execAppAction('zendesk', 'CreateTicket', connection, {
      ticket: {
        comment: {
          body: 'The smoke is very colorful.',
        },
        priority: 'urgent',
        subject: 'My printer is on fire!',
      },
    });

    console.log(response);

    expect(response.body).toHaveProperty('ticket.id');
    ticketID = response.body.ticket.id;
  });

  it('Should get all tickets', () => {
    const response = testApi.execAppAction('zendesk', 'ListTickets', connection);

    expect(response.body).toHaveProperty('tickets');
    expect(response.body.tickets.length).toBeGreaterThan(0);

    ticketCount = response.body.tickets.length;
  });

  it('Should update a ticket', () => {
    const response = testApi.execAppAction('zendesk', 'UpdateTicket', connection, {
      ticket_id: ticketID,
      ticket: {
        comment: {
          body: 'The smoke is very colorful. And it smells like a rainbow.',
        },
      },
    });

    expect(response.body).toHaveProperty('ticket.id');
    expect(response.body.ticket.id).toBe(ticketID);
  });

  it('Should get a ticket by ID', () => {
    const response = testApi.execAppAction('zendesk', 'ShowTicket', connection, {
      ticket_id: ticketID,
    });

    expect(response.body).toHaveProperty('ticket');
    expect(response.body.ticket.id).toBe(ticketID);
    // Check if the body was updated
    expect(response.body.ticket.comment.body).toBe(
      'The smoke is very colorful. And it smells like a rainbow.'
    );
  });

  it('Should delete a ticket', () => {
    testApi.execAppAction('zendesk', 'DeleteTicket', connection, { ticket_id: ticketID });

    const tickets = testApi.execAppAction('zendesk', 'ListTickets', connection);

    expect(tickets.body.tickets.length).toBe(ticketCount - 1);
  });
});
