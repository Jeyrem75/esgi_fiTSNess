import {GymService, SessionService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole, GymStatus} from "../models";

export class GymController {
    constructor(public readonly gymService: GymService,
                public readonly sessionService: SessionService) {
    }

    async createGym(req: Request, res: Response) {
        if(!req.body || !req.body.name || !req.body.address || !req.body.capacity) {
            res.status(400).end();
            return;
        }
        const address = req.body.address;
        if(!address.street || !address.city || !address.zipCode) {
            res.status(400).end();
            return;
        }
        try {
            const gym = await this.gymService.createGym({
                name: req.body.name,
                address: address,
                phone: req.body.phone,
                description: req.body.description,
                equipment: req.body.equipment || [],
                activities: req.body.activities || [],
                capacity: req.body.capacity,
                owner: req.user!._id,
                status: GymStatus.PENDING,
                images: req.body.images || []
            });
            res.status(201).json(gym);
        } catch {
            res.status(500).end();
        }
    }

    async getGyms(req: Request, res: Response) {
        const { status, search } = req.query;
        let gyms;
        
        if (search) {
            gyms = await this.gymService.searchGyms(search as string);
        } else if (status) {
            gyms = await this.gymService.findGymsByStatus(status as GymStatus);
        } else {
            gyms = await this.gymService.findGyms();
        }
        res.json(gyms);
    }

    async getGymById(req: Request, res: Response) {
        const gym = await this.gymService.findGymById(req.params.id);
        if (!gym) {
            res.status(404).end();
            return;
        }
        res.json(gym);
    }

    async getMyGyms(req: Request, res: Response) {
        const gyms = await this.gymService.findGymsByOwner(req.user!._id);
        res.json(gyms);
    }

    async updateGym(req: Request, res: Response) {
        const gym = await this.gymService.findGymById(req.params.id);
        if (!gym) {
            res.status(404).end();
            return;
        }

        if (req.user!.role !== UserRole.SUPER_ADMIN) {
            const gymOwnerId = typeof gym.owner === 'object' ? gym.owner._id.toString() : gym.owner.toString();
            if (gymOwnerId !== req.user!._id) {
                res.status(403).end();
                return;
            }
        }
        
        const updatedGym = await this.gymService.updateGym(req.params.id, req.body);
        res.json(updatedGym);
    }

    async deleteGym(req: Request, res: Response) {
        const gym = await this.gymService.findGymById(req.params.id);
        if (!gym) {
            res.status(404).end();
            return;
        }
        if (req.user!.role !== UserRole.SUPER_ADMIN) {
            res.status(403).end();
            return;
        }
        await this.gymService.deleteGym(req.params.id);
        res.status(204).end();
    }

    async approveGym(req: Request, res: Response) {
        await this.gymService.approveGym(req.params.id);
        res.status(204).end();
    }

    async rejectGym(req: Request, res: Response) {
        await this.gymService.rejectGym(req.params.id);
        res.status(204).end();
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.GYM_OWNER),
            json(),
            this.createGym.bind(this));
        router.get('/',
            sessionMiddleware(this.sessionService),
            this.getGyms.bind(this));
        router.get('/my',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.GYM_OWNER),
            this.getMyGyms.bind(this));
        router.get('/:id',
            sessionMiddleware(this.sessionService),
            this.getGymById.bind(this));
        router.put('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.GYM_OWNER),
            json(),
            this.updateGym.bind(this));
        router.delete('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.GYM_OWNER),
            this.deleteGym.bind(this));
        router.patch('/:id/approve',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.approveGym.bind(this));
        router.patch('/:id/reject',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.rejectGym.bind(this));
        return router;
    }
}