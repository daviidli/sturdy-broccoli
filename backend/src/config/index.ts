import dotenv from 'dotenv';

dotenv.config();

export default {
    port: parseInt(process.env.PORT || '8000', 10),
    maxAttempts: 3,
    suspendTime: {
        minutes: 10
    },
};
