// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import assert = require('assert');
import * as tl from '../_build/task';
import testutil = require('./testutil');

describe('Retry Tests', function () {

    before(function (done) {
        try {
            testutil.initialize();
        }
        catch (err) {
            assert.fail('Failed to load task lib: ' + err.message);
        }
        done();
    });

    after(function () {
    });

    it('retries to execute a function', (done: MochaDone) => {
        this.timeout(1000);

        const testError = Error('Test Error');

        function count(num: number) {
            return () => num--;
        }

        function fail(count: Function) {
            if (count()) {
                throw testError;
            }

            return 'completed';
        }

        function catchError(func: Function, args: any[]) {
            try {
                func(...args);
            } catch (e) {
                return e;
            }
        }

        assert.deepEqual(catchError(tl.retry, [fail, [count(5)], { continueOnError: false, retryCount: 3 }]), testError);
        assert.deepEqual(catchError(tl.retry, [fail, [count(5)], { continueOnError: false, retryCount: 4 }]), testError);
        assert.deepEqual(tl.retry(fail, [count(5)], { continueOnError: false, retryCount: 5 }), 'completed');
        assert.deepEqual(tl.retry(fail, [count(5)], { continueOnError: false, retryCount: 6 }), 'completed');
        assert.deepEqual(tl.retry(fail, [count(5)], { continueOnError: true, retryCount: 3 }), undefined);

        done();
    });
});
