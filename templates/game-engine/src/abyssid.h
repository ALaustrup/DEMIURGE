#ifndef ABYSSID_H
#define ABYSSID_H

#include <string>

struct AbyssIDProfile {
    std::string address;
    std::string username;
    int level;
    int syzygy_score;
};

AbyssIDProfile loadAbyssIDProfile(const char* rpc_url, const std::string& address);

#endif
