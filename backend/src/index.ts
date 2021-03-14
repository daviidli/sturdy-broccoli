import restify from 'restify';
import corsMiddleware from 'restify-cors-middleware';
import cookieParser from 'restify-cookies';
import { makeAGuess, startASession, getDraftOrderUrl } from './api/utils';
import config from './config';
import { Hint } from './interfaces/Hint';

async function startServer() {
    const server = restify.createServer();

    const cors = corsMiddleware({
        credentials: true,
        origins: ['https://secretpasswords.myshopify.com'],
        allowHeaders: [],
        exposeHeaders: ['set-cookie']
    });

    server.pre(cors.preflight);
    server.use(cors.actual);

    server.use(restify.plugins.bodyParser());

    server.use(cookieParser.parse);

    server.listen(config.port, function() {
        console.log(`Server listening on port ${config.port}`);
    });

    server.get('/', function(req, res, next) {
        res.send('Guess The Integer');
        return next();
    });

    server.post('/session/', async function(req, res, next) {
        res.header('content-type', 'json');

        if (!(req.body && req.body.productId && req.socket.remoteAddress)) {
            res.send(400);
            return next();
        }

        const requestIp = req.socket.remoteAddress!;
        const productId = req.body.productId;
        const minValue = req.body.minValue;
        const maxValue = req.body.maxValue;

        try {
            const sessionInfo = startASession(requestIp, productId, minValue, maxValue);

            res.setCookie('secretPasswordId', sessionInfo.id, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/guess'
            });

            res.send(200, sessionInfo);
        } catch(e) {
            res.send(403, e);
        }

        return next();
    });

    server.post('/guess/', async function(req, res, next) {
        res.header('content-type', 'json');
        
        if (!(req.body && req.body.productId && req.body.guess && req.socket.remoteAddress)) {
            res.send(400);
            return next();
        }

        const cookies = req.cookies;

        if (cookies && !cookies['secretPasswordId']) {
            res.send(401);
            return next();
        }

        try {
            const guessResult = makeAGuess(cookies['secretPasswordId'], req.body.guess);

            if (guessResult.hint === Hint.CORRECT) {
                const draftOrderUrl = await getDraftOrderUrl(req.body.productId);
                res.send(200, { ...guessResult, draftOrder: draftOrderUrl });
            } else {
                res.send(200, guessResult);
            }
        } catch (e) {
            res.send(401, e);
        }

        return next();
    });
}

startServer();