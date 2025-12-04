    import { Injectable, OnModuleInit } from '@nestjs/common';
    import { ElasticsearchService } from '@nestjs/elasticsearch';

    @Injectable()
    export class SearchService implements OnModuleInit {
    private readonly indexName = 'users';

    constructor(private readonly esService: ElasticsearchService) {}

    async onModuleInit() {
        await this.createIndexIfNotExists();
    }

    private async createIndexIfNotExists() {
    const indexExists = await this.esService.indices.exists({
        index: this.indexName,
    });

    if (!indexExists) {
        await this.esService.indices.create({
        index: this.indexName,
        mappings: {
            properties: {
            id: { type: 'keyword' },
            name: { 
                type: 'text',
                fields: { keyword: { type: 'keyword' } }
            },
            email: { 
                type: 'text',
                fields: { keyword: { type: 'keyword' } }
            },
            phone: { type: 'keyword' },
            address: { type: 'text' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
            },
        },
        });

        console.log(`✅ Index "${this.indexName}" đã được tạo`);
    }
    }


    // Tìm kiếm users
    async searchUsers(
        query: string,
        current: number = 1,
        pageSize: number = 10,
        filters?: {
        isActive?: boolean;
        address?: string;
        }
    ) {
        const from = (current - 1) * pageSize;

        const mustQueries: any[] = [];
        const filterQueries: any[] = [];

        // Nếu có query string
        if (query && query.trim()) {
        mustQueries.push({
            multi_match: {
            query: query,
            fields: ['name^3', 'email^2', 'phone', 'address'],
            type: 'best_fields',
            fuzziness: 'AUTO',
            operator: 'or',
            },
        });
        }

        // Filters
        if (filters?.isActive !== undefined) {
        filterQueries.push({ term: { isActive: filters.isActive } });
        }

        if (filters?.address) {
        filterQueries.push({
            match: { address: filters.address }
        });
        }

        const searchQuery: any = {
        bool: {},
        };

        if (mustQueries.length > 0) {
        searchQuery.bool.must = mustQueries;
        } else {
        searchQuery.bool.must = { match_all: {} };
        }

        if (filterQueries.length > 0) {
        searchQuery.bool.filter = filterQueries;
        }

        const { hits } = await this.esService.search({
        index: this.indexName,
        from,
        size: pageSize,
        query: searchQuery,
        highlight: {
            fields: {
            name: {},
            email: {},
            phone: {},
            address: {},
            },
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
        },
        sort: [
            { _score: { order: 'desc' } },
            { createdAt: { order: 'desc' } },
        ],
        });

        const total = typeof hits.total === 'number' ? hits.total : hits.total.value;
        const totalPages = Math.ceil(total / pageSize);

        return {
        meta: {
            current,
            pageSize,
            pages: totalPages,
            total,
        },
        results: hits.hits.map((hit: any) => ({
            ...hit._source,
            score: hit._score,
            highlights: hit.highlight,
        })),
        };
    }

    // Index một user
    async indexUser(user: any) {
        try {
        await this.esService.index({
            index: this.indexName,
            id: user.id,
            document: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            },
        });
        console.log(`✅ Indexed user: ${user.email}`);
        } catch (error) {
        console.error('❌ Error indexing user:', error);
        }
    }

    // Update user trong index
    async updateUser(id: string, user: any) {
        try {
        await this.esService.update({
            index: this.indexName,
            id,
            doc: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isActive: user.isActive,
            updatedAt: new Date(),
            },
        });
        console.log(`✅ Updated user in index: ${id}`);
        } catch (error) {
        console.error('❌ Error updating user:', error);
        }
    }

    // Xóa user khỏi index
    async deleteUser(userId: string) {
        try {
        await this.esService.delete({
            index: this.indexName,
            id: userId,
        });
        console.log(`✅ Deleted user from index: ${userId}`);
        } catch (error) {
        console.error('❌ Error deleting user:', error);
        }
    }

    // Bulk index nhiều users (dùng khi migrate data)
    async bulkIndexUsers(users: any[]) {
        const body = users.flatMap((user) => [
        { index: { _index: this.indexName, _id: user.id } },
        {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        ]);

        const { errors } = await this.esService.bulk({ body });

        if (errors) {
        console.error('❌ Bulk indexing có lỗi');
        } else {
        console.log(`✅ Bulk indexed ${users.length} users`);
        }
    }

    // Tìm users theo email domain
    async searchByEmailDomain(domain: string) {
        const { hits } = await this.esService.search({
        index: this.indexName,
        query: {
            wildcard: {
            'email.keyword': `*@${domain}`,
            },
        },
        });

        return hits.hits.map((hit: any) => hit._source);
    }

    // Suggestions (autocomplete)
    async suggestUsers(query: string, size: number = 5) {
        const { hits } = await this.esService.search({
        index: this.indexName,
        size,
        query: {
            multi_match: {
            query,
            fields: ['name', 'email'],
            type: 'bool_prefix',
            },
        },
        });

        return hits.hits.map((hit: any) => ({
        id: hit._source.id,
        name: hit._source.name,
        email: hit._source.email,
        }));
    }
    }