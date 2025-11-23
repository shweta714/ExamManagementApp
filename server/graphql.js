const fs = require('fs');
const path = require('path');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
  } catch (e) {
    return { users: [], dashboards: {}, studentData: {} };
  }
}

const typeDefs = `
  scalar JSON

  type Exam { id: ID!, title: String!, date: String, time: String, daysLeft: Int }
  type Course { code: String!, title: String!, instructor: String, progress: Int }
  type QuizQuestion { id: ID!, text: String!, options: [String!]! }
  type Quiz { id: ID!, title: String!, timeLimit: Int, questions: [QuizQuestion!]! }
  type SeatingOption { examId: String!, location: String! }
  type Seating { reserved: Boolean!, details: JSON, options: [SeatingOption!]! }

  type Dashboard {
    greeting: String
    upcomingExams: [Exam!]
    courses: [Course!]
    seatingPlan: JSON
    timetable: [JSON!]
    important: [String!]
  }

  type Query {
    dashboard(username: String!): Dashboard
    studentData(username: String!): JSON
    courses(username: String!): [Course!]
    quizzes(username: String!, course: String!): [Quiz!]
    seating(username: String!): Seating
  }
`;

const resolvers = {
  JSON: {
    __serialize: (value) => value,
    __parseValue: (value) => value,
    __parseLiteral: () => null
  },
  Query: {
    dashboard: (_, { username }) => {
      const data = readData();
      const key = String(username || '').trim().toLowerCase();
      return (data.dashboards && data.dashboards[key]) || null;
    },
    studentData: (_, { username }) => {
      const data = readData();
      const key = String(username || '').trim().toLowerCase();
      return (data.studentData && data.studentData[key]) || null;
    },
    courses: (_, { username }) => {
      const sd = readData().studentData;
      const key = String(username || '').trim().toLowerCase();
      return (sd && sd[key] && sd[key].courses) || [];
    },
    quizzes: (_, { username, course }) => {
      const sd = readData().studentData;
      const key = String(username || '').trim().toLowerCase();
      const quizzes = (sd && sd[key] && sd[key].quizzes && sd[key].quizzes[course]) || [];
     
      return quizzes.map(q => ({
        id: q.id, title: q.title, timeLimit: q.timeLimit,
        questions: (q.questions || []).map(qq => ({ id: qq.id, text: qq.text, options: qq.options }))
      }));
    },
    seating: (_, { username }) => {
      const sd = readData().studentData;
      const key = String(username || '').trim().toLowerCase();
      return (sd && sd[key] && sd[key].seating) || { reserved: false, options: [] };
    }
  }
};

module.exports = { typeDefs, resolvers };

if (require.main === module) {
  const { ApolloServer } = require('apollo-server');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  // bind to 0.0.0.0 to allow external connections if needed (useful in VMs/containers)
  server.listen({ port, host: '0.0.0.0' })
    .then(({ url }) => {
      console.log(`GraphQL server ready at ${url} (port=${port})`);
    })
    .catch(err => {
      console.error('Failed to start GraphQL server:', err);
      process.exit(1);
    });
}
