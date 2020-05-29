const chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);
let mongoose = require("mongoose");
let Tweet = require('../models/tweet');
const app = require('../app');
const should = chai.should();
chai.use(chaiHttp);

describe('Testing only negative responses for GETs of <<tweets>> route:\n', () => {
    it('GET: it should get an empty array and status 200', (done) => {
        chai.request(app)
            .get('/tweets')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });
    it('GET/:id: it should get an empty array and status 200', (done) => {
        chai.request(app)
            .get('/tweets')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });
    it('GET/:id: it should get an error json and status 200', (done) => {
        chai.request(app)
            .get('/tweets' + 'a123b')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.eql({
                    "error": {
                        "status": 404
                    },
                    "message": "Not Found"
                })
                done();
            });
    });
});
    /*
* Test the /POST route
*/
    //   describe('/POST book', () => {
    //       it('it should not POST a book without pages field', (done) => {
    //           let book = {
    //               title: "The Lord of the Rings",
    //               author: "J.R.R. Tolkien",
    //               year: 1954
    //           }
    //         chai.request(server)
    //             .post('/book')
    //             .send(book)
    //             .end((err, res) => {
    //                   res.should.have.status(200);
    //                   res.body.should.be.a('object');
    //                   res.body.should.have.property('errors');
    //                   res.body.errors.should.have.property('pages');
    //                   res.body.errors.pages.should.have.property('kind').eql('required');
    //               done();
    //             });
    //       });

    //   });
