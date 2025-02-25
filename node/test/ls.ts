import os = require('node:os');
import fs = require('node:fs');
import path = require('node:path');
import assert = require('node:assert');

import * as tl from '../_build/task';

const DIRNAME = __dirname;

import * as testutil from './testutil';

describe('ls cases', () => {
  const TEMP_DIR_1 = path.resolve(DIRNAME, 'temp1');
  const TEMP_SUBDIR_1 = path.resolve(TEMP_DIR_1, 'temp1_subdir1');
  const TEMP_SUBDIR_1_copy = path.relative(TEMP_DIR_1, TEMP_SUBDIR_1);

  let TEMP_FILE_1: string;
  let TEMP_FILE_1_JS: string;
  let TEMP_FILE_2: string;
  let TEMP_FILE_2_JS: string;
  let TEMP_FILE_3_ESCAPED: string;
  let TEMP_HIDDEN_FILE_1: string;
  let TEMP_HIDDEN_DIR_1: string;
  let TEMP_SUBDIR_FILE_1: string;
  let TEMP_SUBDIR_FILELINK_1: string;

  before((done) => {
    try {
      testutil.initialize();
    } catch (error) {
      assert.fail(`Failed to load tl lib: ${error.message}`);
    }

    done();
  });

  after((done) => {
    tl.cd(DIRNAME);
    done();
  });

  beforeEach((done) => {
    tl.mkdirP(TEMP_SUBDIR_1);
    tl.cd(TEMP_DIR_1);

    // TEMP_FILE_1 = path.join(TEMP_DIR_1, 'file1');
    TEMP_FILE_1 = 'file1';
    fs.writeFileSync(TEMP_FILE_1, 'test');
    // TEMP_FILE_1_JS = path.join(TEMP_DIR_1, 'file1.js');
    TEMP_FILE_1_JS = 'file1.js';
    fs.writeFileSync(TEMP_FILE_1_JS, 'test');
    // TEMP_FILE_2 = path.join(TEMP_DIR_1, 'file2');
    TEMP_FILE_2 = 'file2';
    fs.writeFileSync(TEMP_FILE_2, 'test');
    // TEMP_FILE_2_JS = path.join(TEMP_DIR_1, 'file2.js');
    TEMP_FILE_2_JS = 'file2.js';
    fs.writeFileSync(TEMP_FILE_2_JS, 'test');
    // TEMP_FILE_3_ESCAPED = path.join(TEMP_DIR_1, '(filename)e$cap3d.[]^-%');
    TEMP_FILE_3_ESCAPED = '(filename)e$cap3d.[]^-%';
    fs.writeFileSync(TEMP_FILE_3_ESCAPED, 'test');
    // TEMP_HIDDEN_FILE_1 = path.join(TEMP_DIR_1, '.hidden_file');
    TEMP_HIDDEN_FILE_1 = '.hidden_file';
    fs.writeFileSync(TEMP_HIDDEN_FILE_1, 'test');
    // TEMP_HIDDEN_DIR_1 = path.join(TEMP_DIR_1, '.hidden_dir');
    TEMP_HIDDEN_DIR_1 = '.hidden_dir';
    fs.mkdirSync(TEMP_HIDDEN_DIR_1);

    TEMP_SUBDIR_FILE_1 = path.join(TEMP_SUBDIR_1, 'file');
    // TEMP_SUBDIR_FILE_1 = 'file';
    fs.writeFileSync(TEMP_SUBDIR_FILE_1, 'test');

    TEMP_SUBDIR_FILELINK_1 = path.join(TEMP_SUBDIR_1, 'filelink');
    // TEMP_SUBDIR_FILELINK_1 = 'filelink';
    fs.symlinkSync(TEMP_SUBDIR_FILE_1, TEMP_SUBDIR_FILELINK_1);

    // TEMP_SUBDIR_1 = "temp1_subdir1";

    done();
  });

  afterEach((done) => {
    tl.cd(DIRNAME);
    tl.rmRF(TEMP_DIR_1);
    done();
  });

  it('Provide the folder which does not exist', (done) => {
    assert.ok(!fs.existsSync('/thisfolderdoesnotexist'));
    assert.throws(() => tl.ls('/thisfolderdoesnotexist'), { message: /^Not found ls: ENOENT: no such file or directory, lstat/ });
    done();
  });

  it('Without arguments', (done) => {
    const result = tl.ls();
    console.log("Without arguments ", result);
    console.log("TEMP_DIR_1: " + TEMP_DIR_1);
    console.log("TEMP_SUBDIR_1: " + TEMP_SUBDIR_1);
    console.log("TEMP_FILE_1: " + TEMP_FILE_1);
    console.log("TEMP_FILE_1_JS: " + TEMP_FILE_1_JS);
    console.log("TEMP_FILE_2: " + TEMP_FILE_2);
    console.log("TEMP_FILE_2_JS: " + TEMP_FILE_2_JS);
    console.log("TEMP_FILE_3_ESCAPED: " + TEMP_FILE_3_ESCAPED);
    console.log("TEMP_SUBDIR_FILE_1: " + TEMP_SUBDIR_FILE_1);
    console.log("TEMP_SUBDIR_FILELINK_1: ", TEMP_SUBDIR_FILELINK_1);
    console.log("result.length " + result.length);
    assert.ok(result.includes(TEMP_FILE_1));
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    assert.ok(result.includes(TEMP_FILE_3_ESCAPED));
    assert.ok(result.includes(TEMP_SUBDIR_1_copy));
    // assert.equal(result.length, 6);

    done();
  });

  it('Passed TEMP_DIR_1 as an argument', (done) => {
    const result = tl.ls(TEMP_DIR_1);

    // console.log("Passed TEMP_DIR_1 as an argument");
    console.log("Passed TEMP_DIR_1 as an argument", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1));
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    assert.ok(result.includes(TEMP_FILE_3_ESCAPED));
    assert.ok(result.includes(TEMP_SUBDIR_1_copy));
    // assert.equal(result.length, 6);

    done();
  });

  it('Passed file as an argument', (done) => {
    const result = tl.ls(TEMP_FILE_1);
    console.log("Passed TEMP_DIR_1 as an argument", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1));
    assert.equal(result.length, 1);

    done();
  });

  it('Provide the -A attribute as an argument', (done) => {
    tl.cd(TEMP_DIR_1);
    const result = tl.ls('-A');
    console.log("Provide the -A attribute as an argument", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1));
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    assert.ok(result.includes(TEMP_FILE_3_ESCAPED));
    assert.ok(result.includes(TEMP_SUBDIR_1_copy));
    assert.ok(result.includes(TEMP_HIDDEN_FILE_1));
    assert.ok(result.includes(TEMP_HIDDEN_DIR_1));
    assert.equal(result.length, 8);

    done();
  });

  it('Wildcard for TEMP_DIR_1', (done) => {
    const result = tl.ls(path.join(TEMP_DIR_1, '*'));
    console.log("Wildcard for TEMP_DIR_1", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1));
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    assert.ok(result.includes(TEMP_FILE_3_ESCAPED));
    // assert.ok(result.includes(TEMP_SUBDIR_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILE_1)));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 7);

    done();
  });

  it('Wildcard for find f*l*', (done) => {
    const result = tl.ls(path.join(TEMP_DIR_1, 'f*l*'));
    console.log("Wildcard for find f*l*", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1));
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    assert.equal(result.length, 4);

    done();
  });

  it('Wildcard f*l*.js', (done) => {
    const result = tl.ls(path.join(TEMP_DIR_1, 'f*l*.js'));
    console.log("Wildcard f*l*.js", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    assert.equal(result.length, 2);

    done();
  });

  it('Wildcard that is not valid', (done) => {
    const result = tl.ls(path.join(TEMP_DIR_1, '/*.j'));
    console.log("Wildcard that is not valid", result);
    console.log("----------------------------------");
    assert.equal(result.length, 0);

    done();
  });

  it('Wildcard *.*', (done) => {
    const result = tl.ls(path.join(TEMP_DIR_1, '*.*'));
    console.log("Wildcard *.*", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    assert.ok(result.includes(TEMP_FILE_3_ESCAPED));
    assert.equal(result.length, 3);

    done();
  });

  it('Two wildcards in the array', (done) => {
    const result = tl.ls([path.join(TEMP_DIR_1, 'f*le*.js'), path.join(TEMP_SUBDIR_1, '*')]);
    console.log("Two wildcards in the array", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    // assert.ok(result.includes(TEMP_SUBDIR_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILE_1)));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 4);

    done();
  });

  it('Recursive without path argument', (done) => {
    tl.cd(TEMP_DIR_1);
    const result = tl.ls('-R');
    console.log("Recursive without path argument", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1));
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    assert.ok(result.includes(TEMP_FILE_3_ESCAPED));
    // assert.ok(result.includes(TEMP_SUBDIR_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILE_1)));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 7);

    done();
  });

  it('Provide path and recursive attribute', (done) => {
    const result = tl.ls('-R', TEMP_DIR_1);
    console.log("Provide path and recursive attribute", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1));
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    assert.ok(result.includes(TEMP_FILE_3_ESCAPED));
    // assert.ok(result.includes(TEMP_SUBDIR_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILE_1)));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 7);

    done();
  });

  it('Provide path and -RA attributes', (done) => {
    const result = tl.ls('-RA', TEMP_DIR_1);
    console.log("Provide path and -RA attributes", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1));
    assert.ok(result.includes(TEMP_FILE_1_JS));
    assert.ok(result.includes(TEMP_FILE_2));
    assert.ok(result.includes(TEMP_FILE_2_JS));
    assert.ok(result.includes(TEMP_FILE_3_ESCAPED));
    // assert.ok(result.includes(TEMP_SUBDIR_FILE_1));
    assert.ok(result.includes(TEMP_HIDDEN_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILE_1)));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 8);

    done();
  });

  it('Priovide -RA attribute', (done) => {
    const result = tl.ls('-RA', TEMP_SUBDIR_1);
    console.log("Priovide -RA attribute", result);
    console.log("----------------------------------");
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 2);

    done();
  });

  it('Provide path and the -R attribute', (done) => {
    const result = tl.ls('-R', TEMP_SUBDIR_1);
    console.log("Provide path and the -R attribute", result);
    console.log("----------------------------------");
    // assert.ok(result.includes(TEMP_SUBDIR_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILE_1)));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 2);

    done();
  });

  it('Empty attributes, but several paths as multiple arguments', (done) => {
    const result = tl.ls('', TEMP_SUBDIR_1, TEMP_FILE_1);
    console.log("Empty attributes, but several paths as multiple arguments", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILE_1)));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 3);

    done();
  });

  it('Empty attributes, but several paths in array', (done) => {
    const result = tl.ls('', [TEMP_SUBDIR_1]);
    console.log("Empty attributes, but several paths in array");
    console.log("----------------------------------");
    // assert.ok(result.includes(TEMP_SUBDIR_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILE_1)));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 2);

    done();
  });

  it('Empty attributes, but one path', (done) => {
    const result = tl.ls('', TEMP_SUBDIR_1);
    console.log("Empty attributes, but one path", result);
    console.log("----------------------------------");
    // assert.ok(result.includes(TEMP_SUBDIR_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILE_1)));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 2);

    done();
  });

  it('Provide path as first argument and subdir as second argument', (done) => {
    const result = tl.ls(TEMP_FILE_1, TEMP_SUBDIR_1);
    console.log("Provide path as first argument and subdir as second argument", result);
    console.log("----------------------------------");
    assert.ok(result.includes(TEMP_FILE_1));
    // assert.ok(result.includes(TEMP_SUBDIR_FILE_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILE_1)));
    // assert.ok(result.includes(TEMP_SUBDIR_FILELINK_1));
    assert.ok(result.includes(path.relative(TEMP_SUBDIR_1, TEMP_SUBDIR_FILELINK_1)));
    assert.equal(result.length, 3);

    done();
  });

  it('New one folder without content', (done) => {
    tl.mkdirP('foo');
    assert.doesNotThrow(() => tl.ls('foo'));
    assert.equal(tl.ls('foo').length, 0);

    tl.rmRF('foo');

    done();
  });
});