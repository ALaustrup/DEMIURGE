#ifndef QORID_H
#define QORID_H

#include <string>

struct QorIDProfile {
    std::string address;
    std::string username;
    int level;
    int syzygy_score;
};

QorIDProfile loadQorIDProfile(const char* rpc_url, const std::string& address);

#endif
