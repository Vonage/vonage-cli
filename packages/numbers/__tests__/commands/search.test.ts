import { expect, test } from '@oclif/test';
import { baseHost, emptySearchResponse, searchBody, searchResponse, searchOutput, genericAuthError, genericFailedError } from '../fixtures/api-responses';

describe('numbers:search', async () => {
    test
        .stdout()
        .nock(baseHost, api => api
            .get('/search')
            .query(searchBody)
            .reply(200, searchResponse))
        .command(['numbers:search', 'GB'])
        .it('allows simple searching', ctx => {
            expect(ctx.stdout).to.equal(searchOutput)
        });

    test
        .stderr()
        .stdout()
        .nock(baseHost, api => api
            .get('/search')
            .query(searchBody)
            .reply(200, emptySearchResponse))
        .command(['numbers:search', 'GB'])
        .it('displays no results');

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/search')
            .query({
                ...searchBody,
                search_pattern: 0,
                pattern: 12345
            })
            .reply(200, emptySearchResponse))
        .command(['numbers:search', 'GB', '--startsWith=12345'])
        .it('filters using startsWith');

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/search')
            .query({
                ...searchBody,
                search_pattern: 2,
                pattern: 12345
            })
            .reply(200, emptySearchResponse))
        .command(['numbers:search', 'GB', '--endsWith=12345'])
        .it('filters using endsWith');

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/search')
            .query({
                ...searchBody,
                search_pattern: 1,
                pattern: 12345
            })
            .reply(200, emptySearchResponse))
        .command(['numbers:search', 'GB', '--contains=12345'])
        .it('filters using contains');

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/search')
            .query({
                ...searchBody,
                type: 'landline'
            })
            .reply(200, emptySearchResponse))
        .command(['numbers:search', 'GB', '--type=landline'])
        .it('filters by type');

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/search')
            .query({
                ...searchBody,
                features: 'SMS,MMS,VOICE'
            })
            .reply(200, emptySearchResponse))
        .command(['numbers:search', 'GB', '--features=SMS,MMS,VOICE'])
        .it('filters by feature');

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/search')
            .query(searchBody)
            .reply(420, genericFailedError)
        )
        .command(['numbers:search', 'GB'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Method Failed`)
        }).it('notifies on method failure')

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/search')
            .query(searchBody)
            .reply(401, genericAuthError)
        )
        .command(['numbers:search', 'GB'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Authentication Failure`);
        })
        .it('notifies on auth failure')

});