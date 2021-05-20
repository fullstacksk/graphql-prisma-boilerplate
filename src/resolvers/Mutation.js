import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken';
import getUserId from '../utils/getUserId';
import hashPassword from '../utils/hashPassword';

const Mutation = {
	async loginUser(parent, args, { prisma }, info) {
		const [ user ] = await prisma.query.users({
			where: {
				email: args.data.email
			}
		});
		if (!user) throw new Error('Invalid credentials');

		const isMatch = await bcrypt.compare(args.data.password, user.password);
		if (!isMatch) throw new Error('Invalid credentials');
		return {
			user,
			token: await generateToken(user.id)
		};
	},
	async createUser(parent, args, { prisma }, info) {
		const emailTaken = await prisma.exists.User({ email: args.data.email });

		if (emailTaken) {
			throw new Error('Email taken');
		}
		const password = await hashPassword(args.data.password);

		const user = await prisma.mutation.createUser({
			data: {
				...args.data,
				password
			}
		});

		return {
			user,
			token: await generateToken(user.id)
		};
	},
	async deleteUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);
		const userExist = await prisma.exists.User({ id: userId });

		if (!userExist) {
			throw new Error('User not found');
		}

		return prisma.mutation.deleteUser(
			{
				where: { id: userId }
			},
			info
		);
	},
	async updateUser(parent, { data }, { prisma, request }, info) {
		const userId = getUserId(request);
		const userExists = await prisma.exists.User({ id: userId });

		if (!userExists) {
			throw new Error('User not found');
		}
		if (typeof data.password === 'string') data.password = await hashPassword(data.password);
		return prisma.mutation.updateUser(
			{
				where: { id: userId },
				data
			},
			info
		);
	}
};

export { Mutation as default };
